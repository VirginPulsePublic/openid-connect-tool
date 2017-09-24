import Vue from 'vue'
import AppSettings from '@/components/AppSettings'

describe('AppSettings.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(AppSettings)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
