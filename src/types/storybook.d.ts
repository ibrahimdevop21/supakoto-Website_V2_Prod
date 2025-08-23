// Storybook type declarations for development
declare module '@storybook/react' {
  export interface Meta<T = any> {
    title?: string;
    component?: T;
    parameters?: any;
    argTypes?: any;
    args?: any;
    decorators?: any[];
    tags?: string[];
  }

  export interface StoryObj<T = any> {
    args?: any;
    parameters?: any;
    decorators?: any[];
    render?: (args: any) => any;
    name?: string;
  }

  export type StoryFn<T = any> = (args: T) => any;
  export type Story<T = any> = StoryObj<T>;
}
