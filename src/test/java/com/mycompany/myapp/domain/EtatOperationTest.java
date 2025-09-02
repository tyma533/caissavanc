package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EtatOperationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtatOperationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EtatOperation.class);
        EtatOperation etatOperation1 = getEtatOperationSample1();
        EtatOperation etatOperation2 = new EtatOperation();
        assertThat(etatOperation1).isNotEqualTo(etatOperation2);

        etatOperation2.setId(etatOperation1.getId());
        assertThat(etatOperation1).isEqualTo(etatOperation2);

        etatOperation2 = getEtatOperationSample2();
        assertThat(etatOperation1).isNotEqualTo(etatOperation2);
    }
}
