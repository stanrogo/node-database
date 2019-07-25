import Lexer from './sparql/lexer';
import grammar from './sparql/grammar';

const AIMLexer = new Lexer().loadGrammar(grammar);
AIMLexer.loadData('public variable #int32 = 1');
AIMLexer.processAll();
