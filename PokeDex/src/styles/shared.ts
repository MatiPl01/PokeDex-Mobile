import { css } from 'styled-components/native';

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const absoluteFill = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const relativeFill = css`
  position: relative;
  width: 100%;
  height: 100%;
`;
