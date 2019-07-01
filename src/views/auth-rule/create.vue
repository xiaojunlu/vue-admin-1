<template>
<auth-rule-detail :is-edit="true" />
</template>

<script>
import AuthRuleDetail from './components/AuthRuleDetail'

export default {
  name: 'CreateForm',
  components: {
    AuthRuleDetail
  }
}
</script>
