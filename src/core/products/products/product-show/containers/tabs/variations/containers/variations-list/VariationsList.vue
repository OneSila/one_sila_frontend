<script setup lang="ts">

import {getInspectorStatusBadgeMap, Product} from "../../../../../../configs";
import { Button } from "../../../../../../../../../shared/components/atoms/button";
import { Link } from "../../../../../../../../../shared/components/atoms/link";
import {useI18n} from "vue-i18n";
import {SearchConfig} from "../../../../../../../../../shared/components/organisms/general-search/searchConfig";
import {ProductType} from "../../../../../../../../../shared/utils/constants";
import {Pagination} from "../../../../../../../../../shared/components/molecules/pagination";
import {Icon} from "../../../../../../../../../shared/components/atoms/icon";
import {FilterManager} from "../../../../../../../../../shared/components/molecules/filter-manager";
import {ApolloAlertMutation} from "../../../../../../../../../shared/components/molecules/apollo-alert-mutation";
import {
  deleteConfigurableVariationMutation,
  deleteBundleVariationMutation,
  deleteBillOfMaterialMutation,
  updateConfigurableVariationMutation,
  updateBundleVariationMutation,
  updateBillOfMaterialMutation
} from "../../../../../../../../../shared/api/mutations/products.js";
import {Image} from "../../../../../../../../../shared/components/atoms/image";
import {TextInput} from "../../../../../../../../../shared/components/atoms/input-text";
import {ref} from "vue";
import debounce from 'lodash.debounce'
import apolloClient from "../../../../../../../../../../apollo-client";
import {Toast} from "../../../../../../../../../shared/modules/toast";

const { t } = useI18n();
const props = defineProps<{ product: Product, searchConfig: SearchConfig,  listQuery: any; queryKey: any, refetchNeeded: boolean}>();
const emit = defineEmits(['refetched', 'update-ids']);
const localQuantities = ref<{ [key: string]: number }>({});

const initializeLocalQuantities = (data) => {

  if (data[props.queryKey].edges.length !== Object.keys(localQuantities.value).length && props.product.type != ProductType.Configurable) {
    data[props.queryKey].edges.forEach((edge) => {
      localQuantities.value[edge.node.id] = edge.node.quantity;
    });
  }
};

const extractVariationIds = (data) => {

  if (!data || !data.edges) {
    return [];
  }

  return data.edges.map(edge => edge.node.variation.id);
};

const refetchIfNecessary = (query, data) => {
  emit('update-ids', extractVariationIds(data.configurableVariations))
  initializeLocalQuantities(data);
  if (props.refetchNeeded) {
    query.refetch();
    emit('refetched');
  }
  return true;
}

const getDeleteMutation = () => {
  switch(props.product.type) {
    case ProductType.Bundle:
      return deleteBundleVariationMutation;
    case ProductType.Configurable:
      return deleteConfigurableVariationMutation;
    case ProductType.Manufacturable:
      return deleteBillOfMaterialMutation;
    default:
      return null;
  }
};

const getUpdateMutation = () => {
  switch(props.product.type) {
    case ProductType.Bundle:
      return updateBundleVariationMutation;
    case ProductType.Configurable:
      return updateConfigurableVariationMutation;
    case ProductType.Manufacturable:
      return updateBillOfMaterialMutation;
    default:
      return null;
  }
};

const handleQuantityChanged = debounce(async (event, id) => {

  if (event == '' || event == null || isNaN(event)) {
    return
  }

  const inputData = {
    id: id,
    quantity: event
  };

  const {data} = await apolloClient.mutate({
    mutation: getUpdateMutation(),
    variables: {data: inputData}
  });

  if (data) {
    Toast.success(t('shared.alert.toast.submitSuccessUpdate'));
  }
}, 500);




</script>

<template>
  <FilterManager :searchConfig="searchConfig">
    <template v-slot:variables="{ filterVariables, orderVariables, pagination }">
      <ApolloQuery :query="listQuery"
                   :variables="{filter: {...filterVariables, 'parent': {'id': {'exact': product.id}}},
                                order:orderVariables,
                                first: pagination.first,
                                last: pagination.last,
                                before: pagination.before,
                                after: pagination.after }">
        <template v-slot="{ result: { data }, query }">
          <div v-if="data && refetchIfNecessary(query, data)" class="mt-5 panel p-0 border-0 overflow-hidden">
            <div class="table-responsive">
              <table class="table-striped table-hover">
                <thead>
                <tr>
                  <th>{{ t('shared.labels.name') }}</th>
                  <th>{{ t('shared.labels.active') }}</th>
                  <th>{{ t('products.products.labels.inspectorStatus') }}</th>
                  <th v-if="product.type != ProductType.Configurable">{{ t('shared.labels.quantity') }}</th>
                  <th v-if="product.type == ProductType.Manufacturable">{{ t('products.products.labels.productionTime') }}</th>
                  <th class="!text-end">{{ t('shared.labels.actions')}}</th>
                </tr>
                </thead>
                <tbody>

                <tr v-for="item in data[queryKey].edges" :key="item.node.id">
                  <td>
                    <Link :path="{name: 'products.products.show', params: {id: item.node.variation.id}}">
                      <Flex class="gap-4">
                        <FlexCell center>
                          <div v-if="item.node.variation.thumbnailUrl" class="w-8 h-8 overflow-hidden">
                            <Image class="w-8 h-8 rounded-md overflow-hidden object-cover" :source="item.node.variation.thumbnailUrl" :alt="item.node.variation.name" />
                          </div>
                            <div v-else class="w-8 h-8 overflow-hidden rounded-md bg-gray-200 flex justify-center items-center">
                          </div>
                        </FlexCell>
                        <FlexCell center>{{ item.node.variation.name }}</FlexCell>
                      </Flex>
                    </Link>
                  </td>
                  <td>
                    <Icon v-if="item.node.variation.active" name="check-circle" class="ml-2 text-green-500" />
                    <Icon v-else name="times-circle" class="ml-2 text-red-500" />
                  </td>
                  <td>
                    {{ getInspectorStatusBadgeMap()[item.node.variation.inspectorStatus].text }}
                  </td>
                  <td v-if="product.type != ProductType.Configurable">
                    <TextInput v-model="localQuantities[item.node.id]" @update:model-value="handleQuantityChanged($event, item.node.id)" float />
                  </td>
                  <td v-if="product.type == ProductType.Manufacturable">
                    <span v-if="item.node.variation.productionTime">
                      {{ item.node.variation.productionTime }}
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <div class="flex gap-4 items-center justify-end">
                      <ApolloAlertMutation
                        :mutation="getDeleteMutation()"
                        :mutation-variables="{id: item.node.id}"
                        :refetch-queries="() => [{
                         query: listQuery,
                         variables: {
                           filter: {...filterVariables, 'parent': {'id': {'exact': product.id}}},
                           order: orderVariables,
                           first: pagination.first,
                           last: pagination.last,
                           before: pagination.before,
                           after: pagination.after
                         }
                       }]"
                      >
                      <template v-slot="{ loading, confirmAndMutate }">
                        <Button :disabled="loading" class="btn btn-sm btn-outline-danger" @click="confirmAndMutate">
                          {{ t('shared.button.delete') }}
                        </Button>
                      </template>
                    </ApolloAlertMutation>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="py-2 px-2">
              <Pagination :page-info="data[queryKey].pageInfo" />
            </div>
          </div>

        </template>
      </ApolloQuery>

    </template>
  </FilterManager>
</template>
