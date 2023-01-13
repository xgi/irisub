import * as React from "react";

interface BaseIconProps extends React.SVGAttributes<SVGSVGElement> {
  children: React.ReactNode;
}
const Icon: React.FC<BaseIconProps> = (props: BaseIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={15}
      height={15}
      // style={{ width: "1rem", height: "1rem" }}
      {...props}
    >
      {props.children}
    </svg>
  );
};

export const IconStart: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
    </Icon>
  );
};

export const IconDoubleArrowLeft: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
    </Icon>
  );
};

export const Icon10Left: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <g>
        <g>
          <path d="M11.99,5V1l-5,5l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6h-2c0,4.42,3.58,8,8,8s8-3.58,8-8S16.41,5,11.99,5z" />
          <g>
            <path d="M10.89,16h-0.85v-3.26l-1.01,0.31v-0.69l1.77-0.63h0.09V16z" />
            <path d="M15.17,14.24c0,0.32-0.03,0.6-0.1,0.82s-0.17,0.42-0.29,0.57s-0.28,0.26-0.45,0.33s-0.37,0.1-0.59,0.1 s-0.41-0.03-0.59-0.1s-0.33-0.18-0.46-0.33s-0.23-0.34-0.3-0.57s-0.11-0.5-0.11-0.82V13.5c0-0.32,0.03-0.6,0.1-0.82 s0.17-0.42,0.29-0.57s0.28-0.26,0.45-0.33s0.37-0.1,0.59-0.1s0.41,0.03,0.59,0.1c0.18,0.07,0.33,0.18,0.46,0.33 s0.23,0.34,0.3,0.57s0.11,0.5,0.11,0.82V14.24z M14.32,13.38c0-0.19-0.01-0.35-0.04-0.48s-0.07-0.23-0.12-0.31 s-0.11-0.14-0.19-0.17s-0.16-0.05-0.25-0.05s-0.18,0.02-0.25,0.05s-0.14,0.09-0.19,0.17s-0.09,0.18-0.12,0.31 s-0.04,0.29-0.04,0.48v0.97c0,0.19,0.01,0.35,0.04,0.48s0.07,0.24,0.12,0.32s0.11,0.14,0.19,0.17s0.16,0.05,0.25,0.05 s0.18-0.02,0.25-0.05s0.14-0.09,0.19-0.17s0.09-0.19,0.11-0.32s0.04-0.29,0.04-0.48V13.38z" />
          </g>
        </g>
      </g>
    </Icon>
  );
};

export const Icon10Right: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <g>
        <g>
          <path d="M18,13c0,3.31-2.69,6-6,6s-6-2.69-6-6s2.69-6,6-6v4l5-5l-5-5v4c-4.42,0-8,3.58-8,8c0,4.42,3.58,8,8,8s8-3.58,8-8H18z" />
          <polygon points="10.86,15.94 10.86,11.67 10.77,11.67 9,12.3 9,12.99 10.01,12.68 10.01,15.94" />
          <path d="M12.25,13.44v0.74c0,1.9,1.31,1.82,1.44,1.82c0.14,0,1.44,0.09,1.44-1.82v-0.74c0-1.9-1.31-1.82-1.44-1.82 C13.55,11.62,12.25,11.53,12.25,13.44z M14.29,13.32v0.97c0,0.77-0.21,1.03-0.59,1.03c-0.38,0-0.6-0.26-0.6-1.03v-0.97 c0-0.75,0.22-1.01,0.59-1.01C14.07,12.3,14.29,12.57,14.29,13.32z" />
        </g>
      </g>
    </Icon>
  );
};

export const IconDoubleArrowRight: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
    </Icon>
  );
};

export const IconPlay: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon
      {...props}
      // fill="#10b981"
    >
      <path d="M8 5v14l11-7z" />
    </Icon>
  );
};

export const IconPause: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </Icon>
  );
};

export const IconFileUpload: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z" />
    </Icon>
  );
};

export const IconCloud: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </Icon>
  );
};

export const IconInvite: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
    </Icon>
  );
};

export const IconSubtitle: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" />
    </Icon>
  );
};

export const IconPencil: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
    </Icon>
  );
};

export const IconX: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

export const IconGoogle: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon viewBox="0 0 512 512" {...props}>
      <path fill="#4285f4" d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"></path>
      <path fill="#34a853" d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"></path>
      <path fill="#fbbc02" d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"></path>
      <path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"></path>
    </Icon>
  );
};

export const IconMicrosoft: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon viewBox="0 0 512 512" {...props}>
      <path d="M75 75v171h171v-171z" fill="#f25022"></path>
      <path d="M266 75v171h171v-171z" fill="#7fba00"></path>
      <path d="M75 266v171h171v-171z" fill="#00a4ef"></path>
      <path d="M266 266v171h171v-171z" fill="#ffb900"></path>
    </Icon>
  );
};

export const IconGitHub: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon viewBox="0 0 512 512" {...props}>
      <rect width="512" height="512" rx="15%" fill="#181717"></rect>
      <path
        fill="#fff"
        d="M335 499c14 0 12 17 12 17H165s-2-17 12-17c13 0 16-6 16-12l-1-44c-71 16-86-34-86-34-12-30-28-37-28-37-24-16 1-16 1-16 26 2 40 26 40 26 22 39 59 28 74 22 2-17 9-28 16-35-57-6-116-28-116-126 0-28 10-51 26-69-3-6-11-32 3-67 0 0 21-7 70 26 42-12 86-12 128 0 49-33 70-26 70-26 14 35 6 61 3 67 16 18 26 41 26 69 0 98-60 120-117 126 10 8 18 24 18 48l-1 70c0 6 3 12 16 12z"
      ></path>
    </Icon>
  );
};

export const IconEmail: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </Icon>
  );
};

export const IconArrowLeft: React.FC<React.SVGAttributes<SVGSVGElement>> = (
  props: React.SVGAttributes<SVGSVGElement>
) => {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        d="M20.25 12a.75.75 0 01-.75.75H6.31l5.47 5.47a.75.75 0 11-1.06 1.06l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 111.06 1.06l-5.47 5.47H19.5a.75.75 0 01.75.75z"
        clipRule="evenodd"
      />
    </Icon>
  );
};