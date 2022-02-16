import { createAction } from "@reduxjs/toolkit";

const resetState = createAction<Array<string>>('store/resetState');

export { resetState };