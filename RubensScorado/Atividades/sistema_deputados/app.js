const { createApp } = Vue;

createApp({
  data() {
    return {
      deputados: [],
      termoBusca: '',
      ufFiltro: '',
      deputadoSelecionado: null,
      loading: false,
      loadingDetalhes: false,
      ufs: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']
    };
  },
  methods: {
    async buscarDeputados() {
      this.loading = true;
      try {
        const params = {
          ordem: 'ASC',
          ordenarPor: 'nome'
        };
        if (this.termoBusca) params.nome = this.termoBusca;
        if (this.ufFiltro) params.siglaUf = this.ufFiltro;

        const response = await axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados', { params });
        this.deputados = response.data.dados;
      } catch (error) {
        console.error('Erro ao buscar deputados:', error);
      } finally {
        this.loading = false;
      }
    },

    async verDetalhes(id) {
      this.loadingDetalhes = true;
      try {
        const response = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`);
        this.deputadoSelecionado = response.data.dados;
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        this.loadingDetalhes = false;
      }
    },

    voltarListagem() {
      this.deputadoSelecionado = null;
    },

    copiarEmail() {
      const email = this.deputadoSelecionado.ultimoStatus.gabinete.email;
      if (email) {
        navigator.clipboard.writeText(email);
        alert('E-mail copiado para a área de transferência!');
      } else {
        alert('Este deputado não possui e-mail cadastrado.');
      }
    }
  },
  mounted() {
    this.buscarDeputados();
  }
}).mount('#app');
