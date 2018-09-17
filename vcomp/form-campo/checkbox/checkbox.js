(function(vars) {

vars.compMap['form-campo/checkbox'] = function(callback, template) {
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
	data: function() {
		return {
			// valor: this.campo.valor,
			focused: false
		}
	},
	computed: {
		cssClass: function() {
			var campo = this.campo;
			return {
				'campo-checked': campo.checked,
				'campo-focused': this.focused,
				'campo-missing': campo.falta,
				'campo-error': campo.erro
				// 'campo-valid': campo.valido
			};
		}
	},
	methods: {
		campoClick: function() {
			this.$emit('check', {
				campo: this.campo,
				checked: this.campo.checked
			});
		},
		onFocus: function(evt) {
			this.focused = true;
			// console.log('campo/texto focus', evt, this);
			this.$emit('focus', {
				campo: this.campo,
				event: evt
			});
			// if (this.focusRevertScroll) {
			//	 // console.log('texto revertNextScroll', this);
			//	 this.$root.revertNextScroll();
			// }
		},
		onBlur: function(evt) {
			this.focused = false;
			this.$emit('blur', {
				campo: this.campo,
				event: evt
			});
		}
	}
};

})(window._vcomp$);
