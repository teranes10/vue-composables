declare type Last<T extends any[]> = T extends [...any[], infer Z] ? Z : never;
