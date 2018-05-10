import test from 'ava'
import { mount } from '@vue/test-utils'
import PSidebar from '../../components/PSidebar'

let wrapper = mount(PSidebar)

test('test test', t => {
	t.pass();
});

test('PSidebar.vue snapshot', (t) => {
	t.snapshot({ html : wrapper.html() })
})

