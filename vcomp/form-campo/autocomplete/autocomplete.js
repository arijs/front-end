(function(vars) {

var Utils = vars.Utils;

vars.compMap['form-campo/autocomplete'] = function(callback, template) {
	comp.template = template;
	callback(null, comp);
};
var comp = {
	template: null,
	props: {
		campo: {
			type: Object,
			required: true
		},
		focusRevertScroll: {
			type: Boolean,
			default: false
		},
		hideErrorMessage: {
			type: Boolean,
			default: false
		}
	},
	data: function () {
		return {
			searchOpcoes: [],
			searchSelected: 0,
			opened: false,
			focused: false
		}
	},
	computed: {
		cssClass: function () {
			var campo = this.campo;
			return {
				'campo-opened': Boolean(this.opened),
				'campo-focused': Boolean(this.focused),
				'campo-filled': Boolean(campo.selecionado || campo.valor),
				'campo-missing': Boolean(campo.falta),
				'campo-error': Boolean(campo.erro),
				'campo-valid': Boolean(campo.valido)
			};
		}
	},
	methods: {
		setOpened: function (opened) {
			this.opened = opened;
			this.$emit('open', opened);
		},
		setFocused: function (focused) {
			this.focused = focused;
		},
		opcaoClick: function (opcao) {
			this.$emit('valor', {
				campo: this.campo,
				valor: opcao ? opcao.texto : ''
			});
			this.$emit('selecionado', {
				campo: this.campo,
				selecionado: opcao || null
			});
			this.$emit('change');
			this.searchOpcoes = [];
			this.searchSelected = 0;
			this.campoClick();
			// this.emitBlur();
		},
		pressSpaceOpcao: function (opcao, event) {
			this.opcaoClick(opcao);
			event.preventDefault();
		},
		emitFocus: function (evt) {
			this.$emit('focus', evt);
			this.focused = true;
		},
		triggerBlur: function (evt) {
			this.focused = false;
			var act = document.activeElement;
			if (!evt || !act || !Utils.isChildOf(act, this.$el)) {
				this.$emit('blur', evt);
			}
			this.afterBlur();
		},
		afterBlur: function() {
			var selecionado = this.campo.selecionado;
			if (!(selecionado && selecionado.texto === this.campo.valor)) {
				var opcao = this.searchOpcoes[this.searchSelected];
				this.opcaoClick(opcao);
			}
		},
		documentClick: function (ev) {
			if (!Utils.isChildOf(ev.target, this.$el)) {
				this.setOpened(false);
			}
		},
		onTextKeyDown: function(evt) {
			var mov = 0;
			if (evt.keyCode === 38) {
				// seta pra cima
				mov = -1;
			} else if (evt.keyCode === 40) {
				// seta pra baixo
				mov = +1;
			}
			var sol = this.searchOpcoes.length;
			this.searchSelected = ((this.searchSelected + mov) % sol + sol) % sol;
		},
		onTextKeyUp: function() {},
		onFocus: function(evt) {
			this.focused = true;
			this.$emit('focus', evt);
		},
		onBlur: function(evt) {
			this.focused = false;
			this.$emit('blur', evt);
			this.afterBlur();
		},
		onInput: function(evt) {
			var valor = evt.target.value;
			this.$emit('valor', {
				campo: this.campo,
				valor: valor
			});
			this.$emit('input', evt);
			var us = Utils.string;
			if (us) {
				var search = us.search(valor);
				Utils.forEach(this.campo.opcoes, function(o) {
					search.insert(o.texto, o);
				});
				var closest = [];
				Utils.forEach(search.getClosest(this.campo.cutDistance), function(item) {
					var d = item.data;
					closest.push({
						texto: d.texto,
						valor: d.valor,
						item: item
					});
				});
				this.searchSelected = 0;
				this.searchOpcoes = closest;
			}
		},
		onAnimationStart: function(evt) {
			switch (evt.animationName) {
				case 'onAutoFillStart':
					this.onAutoFill(true); break;
				case 'onAutoFillCancel':
					this.onAutoFill(false); break;
			}
			this.$emit('animationstart', evt);
		},
		onAutoFill: function(af) {
			this.autofill = af;
			this.$emit('autofill', af);
		},
		campoClick: function(evt) {
			this.setOpened(!this.opened);
			var input = this.$refs.input;
			if (evt && evt.target !== input) {
				input.focus();
			}
		},
		initSearch: function() {}
	},
	mounted: function () {
		document.documentElement.addEventListener('click', this.documentClick, false);
		utilStringLoad(this.initSearch);
	},
	beforeDestroy: function () {
		document.documentElement.removeEventListener('click', this.documentClick, false);
	}
};

})(window._vcomp$); 
