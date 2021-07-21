import { Parser, Grammar, Rule, Identifier } from ".";

describe("Parser.Parse", () => {
  it("should return a Grammar instance", () => {
    const source = `lhs = rhs ;`;
    const parser = new Parser();
    const grammar = parser.Parse(source);
    expect(grammar).toBeDefined();
    expect(grammar).toBeInstanceOf(Grammar);
    expect(grammar.rules).toHaveLength(1);
  });
});

describe("Parser.ParseRule", () => {
  it("should return a Rule instance", () => {
    const parser = new Parser();
    const rule = parser.ParseRule(`lhs=rhs;`);
    expect(rule).toBeDefined();
    expect(rule).toBeInstanceOf(Rule);
  });
});

describe("Parser.ParseLHS", () => {
  it("should return a LHS instance", () => {
    const parser = new Parser();
    const lhs = parser.ParseLHS(`lhs`);
    expect(lhs).toBeDefined();
    expect(lhs).toBeInstanceOf(Identifier);
    expect((lhs as Identifier).value).toBe(`lhs`);
  });
});

describe("Parser.ParseRaw", () => {
  it("should return a string", () => {
    const parser = new Parser();
    const result = parser.ParseRaw(`=`, /\=/);
    expect(result).toBeDefined();
    expect(result).toBe("=");
  });
});

describe("Parser.ParseWhitespace", () => {
  it("should return whitespace", () => {
    const parser = new Parser();
    const whitespace = parser.ParseWhitespace(`    `);
    expect(whitespace).toBe("    ");
  });
});
