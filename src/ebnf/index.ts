type LetterT =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

type DigitT = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type CharacterT = LetterT | DigitT | "_";

type StartOptionSymbolT = "[";
type EndOptionSymbolT = "]";
type StartRepeatSymbol = "{";
type EndRepeatSymbol = "}";
// type StartGroupSymbol = "(";
// type EndGroupSymbol = ")";
type FirstQuoteSymbol = "'";
type SecondQuoteSymbol = '"';
type DefinitionSymbolT = "=";
type AlternationSymbolT = "|";
type ConcatenationSymbolT = ",";
type TerminationSymbolT = ";";

type SymbolT =
  | StartOptionSymbolT
  | EndOptionSymbolT
  | StartRepeatSymbol
  | EndRepeatSymbol
  // | StartGroupSymbol
  // | EndGroupSymbol
  | FirstQuoteSymbol
  | SecondQuoteSymbol
  | DefinitionSymbolT
  | AlternationSymbolT
  | ConcatenationSymbolT
  | TerminationSymbolT;

class Identifier {
  constructor(public value: string) {}
}

type LHS = Identifier;
type RHS = Identifier;

interface EBNFNode {}

class Rule implements EBNFNode {
  constructor(public lhs: LHS, public rhs: RHS) {}
}

class Grammar implements EBNFNode {
  constructor(public rules: Rule[]) {}
}

class Parser {
  private _cursor: number;

  constructor() {
    this._cursor = 0;
  }

  public get cursor() {
    return this._cursor;
  }

  private set cursor(value) {
    this._cursor = value;
  }

  ParseLetter = (source: string): LetterT | undefined => {
    if (/[A-Za-z]/.test(source[this.cursor])) {
      const letter: LetterT = source[this.cursor] as LetterT;
      this.cursor++;
      return letter;
    }
  };

  ParseDigit = (source: string): DigitT | undefined => {
    if (/[0-9]/.test(source[this.cursor])) {
      const digit: DigitT = source[this.cursor] as DigitT;
      this.cursor++;
      return digit;
    }
  };

  ParseIdentifier = (source: string): Identifier | undefined => {
    const firstCharacter = this.ParseLetter(source);
    if (!firstCharacter) {
      return;
    }

    let value: string = firstCharacter;

    while (this.cursor < source.length) {
      const character = this.ParseAsAnyOf(
        source,
        this.ParseLetter,
        this.ParseDigit,
        (source: string) => {
          if (source[this.cursor] === "_") {
            this.cursor++;
            return "_";
          }
        }
      );

      if (!character) {
        break;
      }

      value = value + character;
    }

    return new Identifier(value);
  };

  ParseRHS = (source: string) => {
    return this.ParseIdentifier(source);
  };

  ParseLHS = (source: string) => {
    return this.ParseIdentifier(source);
  };

  ParseRule = (source: string): Rule | undefined => {
    const lhs = this.ParseLHS(source);

    if (!lhs) {
      return;
    }
    this.cursor++;

    this.ParseWhitespace(source);

    if (!this.ParseRaw(source, /\=/)) {
      return;
    }
    this.ParseWhitespace(source);

    const rhs = this.ParseRHS(source);

    if (!rhs) {
      return;
    }
    this.cursor++;

    this.ParseWhitespace(source);

    if (!this.ParseRaw(source, /;/)) {
      return;
    }

    return new Rule(lhs, rhs);
  };

  ParseGrammar = (source: string): Grammar => {
    const grammar = new Grammar([]);

    while (this.cursor < source.length) {
      this.ParseWhitespace(source);

      const rule = this.ParseRule(source);
      if (!rule) {
        break;
      }

      grammar.rules.push(rule);
    }

    return grammar;
  };

  ParseAsAnyOf = (
    source: string,
    ...parsers: ((source: string) => any)[]
  ): any | undefined => {
    const originalPosition = this.cursor - 1;

    for (const parse of parsers) {
      const result = parse(source);

      if (!result) {
        this.cursor = originalPosition;
        continue;
      }

      return result;
    }
  };

  ParseWhitespace = (source: string): string | undefined => {
    let whitespace = "";

    while (this.cursor < source.length) {
      const character = this.ParseRaw(source, /\s/);

      if (character) {
        whitespace = whitespace + character;
        continue;
      }

      break;
    }

    if (whitespace) {
      return whitespace;
    }
  };

  ParseRaw = (source: string, expected: RegExp): string | undefined => {
    if (expected.test(source[this.cursor])) {
      const character = source[this.cursor];
      this.cursor++;
      return character;
    }
  };

  Parse = (source: string) => {
    return this.ParseGrammar(source);
  };
}

export { Parser, Grammar, Rule, Identifier };
