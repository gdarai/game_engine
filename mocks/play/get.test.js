import { expect, it } from 'vitest'
import { API_ERRORS } from '@api/errors'
import { CARDS, CARD_BACKS } from '@fixtures/cards'
import { PLAY_TEST } from '@fixtures/playTest'
import { TOKENS } from '@fixtures/tokens'
import get from './get'

const memory = { game: { gameId: 'game-1', hashes: ['hash-1', 'hash-2'] } }

it('serves the Play fixture only for a matching game and player hash', () => {
  expect(get.default({ gameId: 'game-1', hash: 'hash-2' }, memory)).toEqual([200, PLAY_TEST])
  expect(get.default({ gameId: 'other', hash: 'hash-2' }, memory))
    .toEqual([404, { message: API_ERRORS.NG_unknownGame }])
  expect(get.default({ gameId: 'game-1', hash: 'invalid' }, memory))
    .toEqual([403, { message: API_ERRORS.NG_invalidPlayerHash }])
})

it('keeps fixture card IDs, backs and trophies consistent with game definitions', () => {
  for (const id of [...PLAY_TEST.offer, ...PLAY_TEST.hand, ...PLAY_TEST.table]) {
    expect(CARDS[id] || CARD_BACKS[id], id).toBeDefined()
  }
  for (const score of PLAY_TEST.scores) {
    for (const code of score.hand) expect(CARD_BACKS[code], code).toBeDefined()
    for (const id of [...score.tasks, ...score.deployed]) expect(CARDS[id], id).toBeDefined()
    for (const code of score.trophy) expect(TOKENS[code], code).toBeDefined()
  }
  for (const code of PLAY_TEST.trophies) expect(TOKENS[code], code).toBeDefined()
})
