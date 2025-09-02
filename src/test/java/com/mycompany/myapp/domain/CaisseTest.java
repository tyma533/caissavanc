package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CaisseTestSamples.*;
import static com.mycompany.myapp.domain.EtablissementTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CaisseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Caisse.class);
        Caisse caisse1 = getCaisseSample1();
        Caisse caisse2 = new Caisse();
        assertThat(caisse1).isNotEqualTo(caisse2);

        caisse2.setId(caisse1.getId());
        assertThat(caisse1).isEqualTo(caisse2);

        caisse2 = getCaisseSample2();
        assertThat(caisse1).isNotEqualTo(caisse2);
    }

    @Test
    void etablissementTest() throws Exception {
        Caisse caisse = getCaisseRandomSampleGenerator();
        Etablissement etablissementBack = getEtablissementRandomSampleGenerator();

        caisse.setEtablissement(etablissementBack);
        assertThat(caisse.getEtablissement()).isEqualTo(etablissementBack);

        caisse.etablissement(null);
        assertThat(caisse.getEtablissement()).isNull();
    }
}
