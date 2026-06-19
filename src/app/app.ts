import { Component, OnInit } from "@angular/core";
import { PrimeNG } from "primeng/config";

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrls: ['../styles.scss']
})
export class AppComponent implements OnInit {

  title = 'Angular-System';

  constructor(private primeNg: PrimeNG) {}

  ngOnInit(): void {
    this.primeNg.ripple.set(true);
    this.primeNg.setTranslation({
      accept: 'Aceitar',
      reject: 'Cancelar',
      // filter
      startsWith: 'Começa com',
      contains: 'Contém',
      notContains: 'Não contém',
      endsWith: 'Termina com',
      equals: 'Igual',
      notEquals: 'Diferente',
      noFilter: 'Sem filtro',
      lt: 'Menor que',
      lte: 'Menor ou igual que',
      gt: 'Maior que',
      gte: 'Maior ou igual que',
      is: 'É',
      isNot: 'Não é',
      before: 'Antes',
      after: 'Depois',
      clear: 'Limpar',
      apply: 'Aplicar',
      matchAll: 'Corresponder a todos',
      matchAny: 'Corresponder a qualquer',
      addRule: 'Adicionar regra',
      removeRule: 'Remover regra',
      // empty message
      emptyMessage: 'Nenhum resultado encontrado',
      // color picker
      choose: 'Escolher',

  })
  }
}
