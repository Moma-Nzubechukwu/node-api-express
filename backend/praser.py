# ── TOKENS ──────────────────────────────────────────────
class Token:
    def __init__(self, type, value):
        self.type  = type   # 'NUM', 'PLUS', 'MINUS', 'STAR', 'SLASH', 'LPAREN', 'RPAREN'
        self.value = value

# ── LEXER ────────────────────────────────────────────────
def lex(text):
    tokens = []
    i = 0
    while i < len(text):
        ch = text[i]
        if ch.isspace():
            i += 1
        elif ch.isdigit() or (ch == '.' and i+1 < len(text) and text[i+1].isdigit()):
            j = i
            while j < len(text) and (text[j].isdigit() or text[j] == '.'):
                j += 1
            tokens.append(Token('NUM', float(text[i:j])))
            i = j
        elif ch == '+': tokens.append(Token('PLUS',   ch)); i += 1
        elif ch == '-': tokens.append(Token('MINUS',  ch)); i += 1
        elif ch == '*': tokens.append(Token('STAR',   ch)); i += 1
        elif ch == '/': tokens.append(Token('SLASH',  ch)); i += 1
        elif ch == '(': tokens.append(Token('LPAREN', ch)); i += 1
        elif ch == ')': tokens.append(Token('RPAREN', ch)); i += 1
        else: raise ValueError(f"Unknown character: {ch!r}")
    return tokens

# ── AST NODES ────────────────────────────────────────────
class Num:
    def __init__(self, value):        self.value = value

class BinOp:
    def __init__(self, left, op, right):
        self.left  = left
        self.op    = op
        self.right = right

# ── PARSER ───────────────────────────────────────────────
# Grammar (encodes precedence):
#   expr   → term   (('+' | '-') term)*
#   term   → factor (('*' | '/') factor)*
#   factor → NUM | '(' expr ')'

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos    = 0

    def peek(self):
        return self.tokens[self.pos] if self.pos < len(self.tokens) else None

    def consume(self, type):
        tok = self.peek()
        if tok is None or tok.type != type:
            raise SyntaxError(f"Expected {type}, got {tok}")
        self.pos += 1
        return tok

    def factor(self):                          # highest precedence
        tok = self.peek()
        if tok and tok.type == 'NUM':
            self.consume('NUM')
            return Num(tok.value)
        elif tok and tok.type == 'LPAREN':
            self.consume('LPAREN')
            node = self.expr()
            self.consume('RPAREN')
            return node
        raise SyntaxError(f"Unexpected token: {tok}")

    def term(self):                            # * and /
        node = self.factor()
        while self.peek() and self.peek().type in ('STAR', 'SLASH'):
            op = self.consume(self.peek().type)
            node = BinOp(node, op.type, self.factor())
        return node

    def expr(self):                            # + and -  (lowest precedence)
        node = self.term()
        while self.peek() and self.peek().type in ('PLUS', 'MINUS'):
            op = self.consume(self.peek().type)
            node = BinOp(node, op.type, self.term())
        return node

    def parse(self):
        return self.expr()

# ── EVALUATOR ────────────────────────────────────────────
def evaluate(node):
    if isinstance(node, Num):
        return node.value
    if isinstance(node, BinOp):
        left  = evaluate(node.left)
        right = evaluate(node.right)
        if node.op == 'PLUS':  return left + right
        if node.op == 'MINUS': return left - right
        if node.op == 'STAR':  return left * right
        if node.op == 'SLASH':
            if right == 0: raise ZeroDivisionError("Division by zero")
            return left / right

# ── MAIN ─────────────────────────────────────────────────
def calc(text):
    tokens = lex(text)
    tree   = Parser(tokens).parse()
    return evaluate(tree)

# Test it
print(calc("12 + 3 * (4 - 1)"))   # → 21.0
print(calc("100 / (2 + 3)"))       # → 20.0
print(calc("3.5 * 2 - 1"))         # → 6.0
