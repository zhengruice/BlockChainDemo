export default {
  name: 'MainSubTableSelectQueryItem',
  props: {
    queryParams: Object,
    queryConfigs: Array,
  },
  data() {
    return {}
  },
  methods: {
    renderQueryItem() {
      console.log(this.queryParams, this.queryConfigs);
      return this.queryConfigs.map(queryItem => {
        const {key, label, placeholder, dictCode, props, customRender, readOnly} = queryItem
        const options = {
          props: {},
          on: {
            pressEnter: () => this.$emit('pressEnter'),
          }
        }
        if (props != null) {
          Object.assign(options.props, props)
        }
        if (placeholder === undefined) {
          if (dictCode) {
            options.props['placeholder'] = `请选择${label}`
          } else {
            options.props['placeholder'] = `请输入${label}`
          }
        } else {
          options.props['placeholder'] = placeholder
        }

        let input
        if (typeof customRender === 'function') {
          input = customRender.call(this, {key, options, queryParams: this.queryParams})
        } else if (dictCode) {
          input = <j-multi-select-tag {...options} vModel={this.queryParams[key]} dictCode={dictCode} disabled={readOnly}/>
        } else {
          input = <a-input {...options} vModel={this.queryParams[key]} disabled={readOnly}/>
        }
        
        return <a-col md={12} sm={16} ><a-form-item key={key} label={label}>{input}</a-form-item></a-col>
      })
    },
  },
  render() {
    return <span>{this.renderQueryItem()}</span>
  },
}