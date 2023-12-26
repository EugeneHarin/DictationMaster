const { db } = require('@vercel/postgres');
const {
  users,
  dictations
} = require('../app/lib/database-placeholder-data.js');
const { hashPassword } = require('../scripts/password-utils.js');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(255),
        image_url VARCHAR(255)
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = hashPassword(user.password.normalize('NFKC'));
        return client.sql`
          INSERT INTO users (id, name, email, password, image_url, role)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.image_url}, ${user.role})
          ON CONFLICT (id) DO NOTHING;
        `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedDictations(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "dictations" table if it doesn't exist
    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS dictations (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        teacher_id UUID REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(3000) NOT NULL,
        words_count INT NOT NULL,
        audio_file_url VARCHAR(1600),
        audio_file_exp_date TIMESTAMPTZ,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      );
    `;

    console.log(`Created "dictations" table`);

    // Insert data into the "dictations" table
    const insertedDictations = await Promise.all(
      dictations.map(
        (dictation) => client.sql`
        INSERT INTO dictations (teacher_id, title, content, words_count, status, date)
        VALUES (${dictation.teacher_id}, ${dictation.title}, ${dictation.content}, ${dictation.words_count}, ${dictation.status}, ${dictation.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedDictations.length} dictations`);

    return {
      createTable,
      dictations: insertedDictations,
    };
  } catch (error) {
    console.error('Error seeding dictations:', error);
    throw error;
  }
}

async function dropAllTables(client) {
  try {
    client.sql`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `;
    console.log('Dropped all tables');
  } catch (error) {
    console.error('Error dropping all tables:', error);
    throw error;
  }
}


async function seedResults(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "results" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS results (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        student_id UUID REFERENCES users(id) NOT NULL,
        dictation_id UUID REFERENCES dictations(id) NOT NULL,
        result_errors JSONB,
        errors_number NUMERIC(4, 0),
        result_html VARCHAR(3000) NOT NULL,
        date DATE NOT NULL
      );
    `;

    console.log(`Created "results" table`);

    return {
      createTable
    };
  } catch (error) {
    console.error('Error seeding results:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await dropAllTables(client);
  await seedUsers(client);
  await seedDictations(client);
  await seedResults(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
