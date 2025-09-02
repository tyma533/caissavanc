package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CaisseTestSamples.*;
import static com.mycompany.myapp.domain.ControleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ControleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Controle.class);
        Controle controle1 = getControleSample1();
        Controle controle2 = new Controle();
        assertThat(controle1).isNotEqualTo(controle2);

        controle2.setId(controle1.getId());
        assertThat(controle1).isEqualTo(controle2);

        controle2 = getControleSample2();
        assertThat(controle1).isNotEqualTo(controle2);
    }

    @Test
    void caisseTest() throws Exception {
        Controle controle = getControleRandomSampleGenerator();
        Caisse caisseBack = getCaisseRandomSampleGenerator();

        controle.setCaisse(caisseBack);
        assertThat(controle.getCaisse()).isEqualTo(caisseBack);

        controle.caisse(null);
        assertThat(controle.getCaisse()).isNull();
    }
}
