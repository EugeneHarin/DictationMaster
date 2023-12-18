const { db } = require('@vercel/postgres');
const {
  teachers,
  users,
  dictations
} = require('../app/lib/database-placeholder-data.js');
const bcrypt = require('bcrypt');
const { sql } = require("@vercel/postgres");

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
        role VARCHAR(255)
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
          INSERT INTO users (name, email, password, role)
          VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.role})
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
    const insertedTeachers = await Promise.all(
      teachers.map(
        (teacher) => client.sql`
          INSERT INTO teachers (id, name, email, image_url)
          VALUES (${teacher.id}, ${teacher.name}, ${teacher.email}, ${teacher.image_url})
          ON CONFLICT (id) DO NOTHING;
        `,
      ),
    );

    console.log(`Seeded ${insertedTeachers.length} teachers`);

    return {
      createTable,
      teachers: insertedTeachers,
    };
  } catch (error) {
    console.error('Error seeding teachers:', error);
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
        teacher_id UUID REFERENCES teachers(id) NOT NULL,
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

async function main() {
  const client = await db.connect();

  await dropAllTables(client);
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
