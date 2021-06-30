<template>
  <div class="q-pa-md">
    <q-table
      title="Alerts"
      :data="data"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="negative"
            icon-right="delete"
            no-caps
            flat
            dense
            @click="removeRow(data.indexOf(props.row))"
          />
        </q-td>
      </template>
    </q-table>
    <q-pagination v-model="current" :max="totalNum" @input="handlePage" />

    <ModalWindow
      :accept="plug"
    >
      <form class="common-form" v-on:submit.prevent="">
        <input
          type="email"
          :class="
            emailIsIncorrect && 'common-form__error-input'
          "
          placeholder="email"
          v-model="email"
          @input="handleEmail"
        />
        <div class="common-form__error-text">
          <span v-if="emailIsIncorrect">{{ $t('enterCorrectEmail') }}</span>
        </div>
      </form>
    </ModalWindow>
  </div>
</template>

<script>
import ModalWindow from 'src/components/ModalWindow.vue';

export default {
  name: 'Alerts',
  components: {
    ModalWindow,
  },
  data() {
    return {
      current: 1,
      page: 0,
      totalNum: 0,
      email: '',
      emailIsIncorrect: false,
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
          sortable: true,
        },
        {
          name: 'type',
          align: 'center',
          label: 'Notification type',
          field: 'type',
          sortable: true,
        },
        {
          name: 'address',
          align: 'center',
          label: 'Notification address',
          field: 'address',
          sortable: true,
        },
        {
          name: 'action',
          label: 'Action',
          field: 'action',
        },
      ],
      data: [
        {
          id: '1',
          type: 'E-mail',
          address: 'test@test.ru',
        },
        {
          id: '2',
          type: 'E-mail',
          address: 'test@test.ru',
        },
      ],
    };
  },
  methods: {
    plug() {
      if (!this.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
        this.emailIsIncorrect = true;
        return false;
      }
      this.data.push({
        id: this.data.length,
        type: 'E-mail',
        address: this.email,
      });
      return true;
    },

    handleEmail() {
      this.emailIsIncorrect = false;
    },

    removeRow(rowIdx) {
      this.data = [
        ...this.data.filter((row, idx) => idx !== rowIdx),
      ];
    },

    handlePage(e) {
      this.page = e;
    },
  },
};
</script>
