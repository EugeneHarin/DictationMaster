const { db } = require('@vercel/postgres');
const {
  teachers,
  users,
  dictations
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`DROP TABLE IF EXISTS users`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
          INSERT INTO users (id, name, email, password)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
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

async function seedTeachers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`DROP TABLE IF EXISTS teachers cascade`;
    // Create the "teachers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS teachers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "teachers" table`);

    // Insert data into the "teachers" table
    const insertedCustomers = await Promise.all(
      teachers.map(
        (teacher) => client.sql`
          INSERT INTO teachers (id, name, email, image_url)
          VALUES (${teacher.id}, ${teacher.name}, ${teacher.email}, ${teacher.image_url})
          ON CONFLICT (id) DO NOTHING;
        `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} teachers`);

    return {
      createTable,
      teachers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding teachers:', error);
    throw error;
  }
}

async function seedDictations(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`DROP TABLE IF EXISTS dictations`;
    // Create the "dictations" table if it doesn't exist
    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS dictations (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        teacher_id UUID REFERENCES teachers(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(3000) NOT NULL,
        words_count INT NOT NULL,
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

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedTeachers(client);
  await seedDictations(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
