/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCollection } from './components/ProductCollection';
import { CustomAndStory } from './components/CustomAndStory';
import { WhatsAppOrderBuilder } from './components/WhatsAppOrderBuilder';
import { PoliciesAndFaq } from './components/PoliciesAndFaq';
import { SisterBrandAndFooter } from './components/SisterBrandAndFooter';
import type { OrderFormInput, OrderProductSelection } from './utils/whatsapp';

export default function App() {
  const [formState, setFormState] = useState<OrderFormInput>({
    product: 'pencil',
    quantity: 1,
    customerName: '',
    phone: '',
    colour: '',
    personalisation: '',
    message: '',
    address: '',
    delivery: 'DTDC courier',
    bulk: 'No',
    policyAgreed: false,
  });

  const handleSelectProductForOrder = (
    productId: OrderProductSelection,
    customNote?: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      product: productId,
      message: customNote ? customNote : prev.message,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC] text-[#191715]">
      <Navbar onSelectOrderSection={() => {}} />

      <main className="flex-1">
        <Hero onQuickConfigureProduct={handleSelectProductForOrder} />

        <ProductCollection
          selectedProductId={formState.product}
          onSelectProductForOrder={handleSelectProductForOrder}
        />

        <CustomAndStory onSelectCustomInOrderForm={handleSelectProductForOrder} />

        <WhatsAppOrderBuilder
          formState={formState}
          onChangeFormState={setFormState}
        />

        <PoliciesAndFaq />
      </main>

      <SisterBrandAndFooter />
    </div>
  );
}
