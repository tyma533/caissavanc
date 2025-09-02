package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CaisseRubriqueTestSamples.*;
import static com.mycompany.myapp.domain.CaisseTestSamples.*;
import static com.mycompany.myapp.domain.RubriqueTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CaisseRubriqueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CaisseRubrique.class);
        CaisseRubrique caisseRubrique1 = getCaisseRubriqueSample1();
        CaisseRubrique caisseRubrique2 = new CaisseRubrique();
        assertThat(caisseRubrique1).isNotEqualTo(caisseRubrique2);

        caisseRubrique2.setId(caisseRubrique1.getId());
        assertThat(caisseRubrique1).isEqualTo(caisseRubrique2);

        caisseRubrique2 = getCaisseRubriqueSample2();
        assertThat(caisseRubrique1).isNotEqualTo(caisseRubrique2);
    }

    @Test
    void caisseTest() throws Exception {
        CaisseRubrique caisseRubrique = getCaisseRubriqueRandomSampleGenerator();
        Caisse caisseBack = getCaisseRandomSampleGenerator();

        caisseRubrique.setCaisse(caisseBack);
        assertThat(caisseRubrique.getCaisse()).isEqualTo(caisseBack);

        caisseRubrique.caisse(null);
        assertThat(caisseRubrique.getCaisse()).isNull();
    }

    @Test
    void rubriqueTest() throws Exception {
        CaisseRubrique caisseRubrique = getCaisseRubriqueRandomSampleGenerator();
        Rubrique rubriqueBack = getRubriqueRandomSampleGenerator();

        caisseRubrique.setRubrique(rubriqueBack);
        assertThat(caisseRubrique.getRubrique()).isEqualTo(rubriqueBack);

        caisseRubrique.rubrique(null);
        assertThat(caisseRubrique.getRubrique()).isNull();
    }
}
