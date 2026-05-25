// --- Remoção de Números Mágicos ---
const ADMIN_PREMIUM_THRESHOLD = 1000;
const USER_MAX_VALUE = 500;

// --- Replace Conditional with Polymorphism (Padrão Strategy) ---
class CSVFormatter {
  buildHeader() {
    return 'ID,NOME,VALOR,USUARIO\n';
  }

  buildRow(item, user) {
    return `${item.id},${item.name},${item.value},${user.name}\n`;
  }

  buildFooter(total) {
    return `\nTotal,,\n${total},,\n`;
  }
}

class HTMLFormatter {
  buildHeader(item) {
    let header = '<html><body>\n';
    header += '<h1>Relatório</h1>\n';
    header += `<h2>Usuário: ${user.name}</h2>\n`;
    header += '<table>\n';
    header += '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n';
    return header;
  }

  buildRow(item, user) {
    const style = item.priority ? 'style="font-weight:bold;"' : '';
    return `<tr ${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }

  buildFooter(total) {
    let footer = '</table>\n';
    footer += `<h3>Total: ${total}</h3>\n`;
    footer += '</body></html>\n';
    return footer;
  }
}

export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  // O Método principal agora é limpo e orquestra as chamadas (Extract Method)
  generateReport(reportType, user, items) {
    const formatter = this._getFormatter(reportType);
    const validItems = this._filterAndProcessItems(items, user);

    let report = formatter.buildHeader(user);
    let total = 0;

    for (const item of validItems) {
      report += formatter.buildRow(item, user);
      total += item.value;
    }

    report += formatter.buildFooter(total);

    return report.trim();
  }

  // Fábrica para selecionar a estratégia de formatação
  _getFormatter(reportType) {
    const formatters = {
      'CSV': new CSVFormatter(),
      'HTML': new HTMLFormatter()
    };
    
    if (!formatters[reportType]) {
      throw new Error(`Formato de relatório não suportado: ${reportType}`);
    }
    
    return formatters[reportType];
  }

  // Decompose Conditional: Isola a regra de negócio de quem vê o quê
  _filterAndProcessItems(items, user) {
    if (user.role === 'ADMIN') {
      return items.map(item => {
        if (item.value > ADMIN_PREMIUM_THRESHOLD) {
          item.priority = true;
        }
        return item;
      });
    }

    if (user.role === 'USER') {
      return items.filter(item => item.value <= USER_MAX_VALUE);
    }

    return [];
  }
}