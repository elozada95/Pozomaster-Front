import test from 'ava'
import { mount } from '@vue/test-utils'
import ContentHeader from '../../components/ContentHeader'

let wrapper

const title = "new title"

test.beforeEach(() => {
  wrapper = mount(ContentHeader, {
    propsData: { title },
  })
})

test('ContentHeader.vue shapshow', (t) => {
  t.snapshot({ html: wrapper.html() })
})

test('Renders props.title when passed', t => {
  t.is(wrapper.text(), title)
})
