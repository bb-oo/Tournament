import Knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const knex = Knex({
  dialect: 'pg',
  connection: process.env.DATABASE_URL
});

export function postUser(data) {
  const query = knex
    .insert({
      username: data.username,
      email: data.email,
      default_address: data.walletAddress
    })
    .into('users');

  return query;
};

export function postEvent(data) {
  const query = knex('events')
    .returning('id')    
    .insert({
      organizer_id: data.organizer,
      title: data.title,
      public: data.isPublic,
      start_date: data.start,
      end_date: data.end,
      address: data.address,
      location: data.location,
      terms: data.terms
    });
    
  return query;
};

export function postTournament(data) {
  const query = knex
    .insert({
      event_id: data.eventId,
      tournament_id: data.tournamentId,
      max_participants: data.max,
      min_participants: data.min,
      buyin: data.buyIn,
      guarantee: data.guarantee,
      terms: data.terms
    })
    .into('tournaments');

  return query;
};
  
export function postGame(data) {
  const query = knex  
    .insert({
      event_id: data.eventId,
      game_id: data.gameId,
      max_participants: data.max,
      max_buyin: data.maxBuyIn,
      min_buyin: data.minBuyIn,
      terms: data.terms
    })
    .into('game');

  return query;
};

export function postParticipant(data) {
  const query = knex
    .insert({
      event_id: data.eventId,
      user_id: data.userId,
      start_date: data.start,
      end_date: data.end,
      paid: data.paid,
      prize: data.prize,
      note: data.note
    })
    .into('participants');

  return query;
};

export function getUser(username) {
  const query = knex
    .table('users')
    .where({
      username: username
    });

  return query;
};
  
export function getParticipantPendingEvents(userId) {
  const query = knex
    .table('participants')
    .where({
      user_id: userId,
      registered: false
    })
    .innerJoin('events', 'event_id', '=', 'events.id')
    .orderBy('events.id', 'asc')
    .limit(5);

  return query;
};

export function getParticipantUpcomingEvents(userId) {
  const currentDate = Date.now();
  const query = knex 
    .table('participants')
    .where({
      user_id: userId,
      registered: true,
      
    })
    .andWhere('start_time', '>', currentDate)
    .innerJoin('events', 'event_id', '=', 'events.id')
    .orderBy('events.id', 'asc')
    .limit(5);

  return query;
};

export function getParticipantPastEvents(userId) {
  const currentDate = Date.now();
  const query = knex
    .table('participants')
    .where({
      user_id: userId
    })
    .andWhere('start_time', '<', currentDate)
    .innerJoin('events', 'event_id', '=', 'events.id')
    .orderBy('events.id', 'asc')
    .limit(5);

  return query;
};

export function getEventAndOrganizer(id, address) {
  const query = knex
    .table('events')
    .where({
      organizer_id: id,
      address: address
    });

  return query;
}

export function getUserAddress(userName) {
  const query = knex  
    .table('users')
    .where({
      username: userName
    })
    .select('default_address');
    
  return query;
}