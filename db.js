const path = require('path')

const dbPath = path.resolve(__dirname, 'db/database.sqlite')

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true
})


knex.schema
  // Make sure no "books" table exists
  // before trying to create new
  .hasTable('event')
  .then((exists) => {
    if (!exists) {
      // If no "books" table exists
      // create new, with "id", "author", "title",
      // "pubDate" and "rating" columns
      // and use "id" as a primary identification
      // and increment "id" with every new record (book)
      return knex.schema.createTable('event', (table) => {
        table.increments('id').primary()
        table.string('name')
        table.string('groupA')
        table.string('groupB')
        table.string('groupC')
        table.date('eventStart')
      })
        .then(() => {
          // Log success message
          console.log('Table \'Event\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
    }
  })
  .then(() => {
    // Log success message
    console.log('done')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })

knex.schema
  // Make sure no "books" table exists
  // before trying to create new
  .hasTable('team')
  .then((exists) => {
    if (!exists) {
      // If no "books" table exists
      // create new, with "id", "author", "title",
      // "pubDate" and "rating" columns
      // and use "id" as a primary identification
      // and increment "id" with every new record (book)
      return knex.schema.createTable('team', (table) => {
        table.increments('id').primary()
        table.string('name')
        table.string('owner')
        table.string('player1')
        table.string('player2')
        table.string('player3')
        table.string('player4')
        table.string('player5')
        table.integer('eventId')
        table.string('tiebreaker')
        table.string('contactEmail')
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
        .then(() => {
          // Log success message
          console.log('Table \'Team\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
    }
  })
  .then(() => {
    // Log success message
    console.log('done')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })

knex.select('*').from('event')
  .then(data => console.log('data:', data))
  .catch(err => console.log(err))

knex.select('*').from('team')
  .then(data => console.log('data:', data))
  .catch(err => console.log(err))

module.exports = knex
