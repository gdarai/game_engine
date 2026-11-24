import { API_ERRORS } from '@api/errors'
import { PLAY_TEST } from '@fixtures/playTest'
import { error } from '@mocks/error'
import * as playTest from '@mockFixtures/playTest';

export default {
  default: ({ gameId, hash }, mockMemory) => {
    const game = mockMemory.game
    if (!game || game.gameId !== gameId) return [404, { message: API_ERRORS.NG_unknownGame }]
    if (!game.hashes.includes(hash)) return [403, { message: API_ERRORS.NG_invalidPlayerHash }]
    return [200, PLAY_TEST]
  },
  playTest: (_, mockMemory) => {
    const mockMemoryPhase = mockMemory.playPhase || 0;
    const states = ["draw", "draw", "play", "place", "dash"];
    const playPhase = mockMemoryPhase + 1 > (states.length - 1) ? 0 : mockMemoryPhase + 1;
    const game = {
      map: playTest.shape,
      tokens: playTest.tokens,
      offer: ["s", "h", "w", "b"],
      hand: ["W02", "W04"],
      table: ["B03"],
      trophies: "ss",
      scores: playTest.scores,
      waitFor: playPhase === 0 ? 2 : 1,
      extra: "",
      state: states[playPhase],
    };
    return [200, game, { playPhase }];
  },

  error,
}
