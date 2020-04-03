const US_PHONE_NUMBER = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
const EMAIL = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
const POSTAL_CODE = /^[0-9]{5}([- /]?[0-9]{4})?$/;
const US_STATES = /^((A[LKSZR])|(C[AOT])|(D[EC])|(F[ML])|(G[AU])|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EHDAINSOT])|(N[EVHJMYCD])|(MP)|(O[HKR])|(P[WAR])|(RI)|(S[CD])|(T[NX])|(UT)|(V[TIA])|(W[AVIY]))$/;

const REGEX = {
  EMAIL,
  POSTAL_CODE,
  US_PHONE_NUMBER,
  US_STATES,
};

export default REGEX;
