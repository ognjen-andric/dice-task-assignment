# Please read thoroughly :)

## Dice betting task assignment

Prerequisites :

- NodeJS v16.10.0 +

Setup process :

- Clone the repository
- Once inside, run `npm install` in order to install all dependencies
- After that, enter `app` folder and run `npm install` there as well.
- Go back to root of the project.
- Run `npm run full-app` to run the BE part of the dice betting assingment

## Authorization

- To authorize yourself to do mutations, you will need to send an authorization header with a value that represents `User.id`. There is not strict authentication system required so this is what I've implemented so that we can switch which users are making the bets.

- To see possible user ids, I am automatically populating `User` table [here](/src/repository/user/user.sqlite.repository.ts) so by default you can choose between users `1 - Foo` and `2 - Bar`.

## Testing

Due to limited time, I am unsure if I will manage to write detailed tests with decent mocks.
Either way, since we are using DI for our repositories, it will be easy to introduce mocks and write tests without actually manipulating any real data.

That way we can actually write our unit and integration tests fairly fast and ensure that our future changes do not break our current features.

## Transactions

As I was using `sqlite::memory` in order to mimic a real database, I am unsure sequalize supports transactions on in-memory storages.

Once this code would switch to some relational database, we would be able to implement transactions.

We wish to implement transactions on every mutation that involves sensitive data. Creating a bet and maintaining users balance in correct state is crucial to ensure neither provider or player lose any money due to unexpected errors.

If an error occurs, users balance does not change and neither a game is created.

If error does not occur, changes are commited. While commiting changes, it is important to know how transactions actually work in the background as you can still end up with missing/broken data even with Transactions if applied incorrectly.

## Relations

Also, another thing that should be implemented here are relations between tables. That will speed up our queries once our tables get large due to indexing.

## UI

Wrote UI in like 5 minutes just to have a bit nicer visualization of the game itself. Only bet feature is supported as I am too tired to actually focus on the UI itself and its functionality, this was just a bonus as it felt empty without it.

## URLS :

- localhost:4000 -> BE
- localhost:3000 -> FE
