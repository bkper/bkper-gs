
var expect = require('chai').expect;

describe('Normalizer_', () => {
  it('should normalize accents', () => {
     expect(Normalizer_.normalizeText("Á é î õ ú ão")).to.equal("a e i o u ao");
  });
  it('should normalize with dash', () => {
     expect(Normalizer_.normalizeText("Á é î-õ ú ão", "_")).to.equal("a_e_i_o_u_ao");
  });
  it('should clear multiple spaces', () => {
     expect(Normalizer_.normalizeText("Á é     î õ ú   -   ão    ", "_")).to.equal("a_e_i_o_u_ao");
  });
  it('should normalize with space and dash', () => {
     expect(Normalizer_.normalizeText("Anticipo_ IRAE", "_")).to.equal("anticipo_irae");
  });
});

