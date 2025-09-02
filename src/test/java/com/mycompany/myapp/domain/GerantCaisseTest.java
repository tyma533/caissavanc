package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CaisseTestSamples.*;
import static com.mycompany.myapp.domain.GerantCaisseTestSamples.*;
import static com.mycompany.myapp.domain.GerantTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GerantCaisseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GerantCaisse.class);
        GerantCaisse gerantCaisse1 = getGerantCaisseSample1();
        GerantCaisse gerantCaisse2 = new GerantCaisse();
        assertThat(gerantCaisse1).isNotEqualTo(gerantCaisse2);

        gerantCaisse2.setId(gerantCaisse1.getId());
        assertThat(gerantCaisse1).isEqualTo(gerantCaisse2);

        gerantCaisse2 = getGerantCaisseSample2();
        assertThat(gerantCaisse1).isNotEqualTo(gerantCaisse2);
    }

    @Test
    void caisseTest() throws Exception {
        GerantCaisse gerantCaisse = getGerantCaisseRandomSampleGenerator();
        Caisse caisseBack = getCaisseRandomSampleGenerator();

        gerantCaisse.setCaisse(caisseBack);
        assertThat(gerantCaisse.getCaisse()).isEqualTo(caisseBack);

        gerantCaisse.caisse(null);
        assertThat(gerantCaisse.getCaisse()).isNull();
    }

    @Test
    void gerantTest() throws Exception {
        GerantCaisse gerantCaisse = getGerantCaisseRandomSampleGenerator();
        Gerant gerantBack = getGerantRandomSampleGenerator();

        gerantCaisse.setGerant(gerantBack);
        assertThat(gerantCaisse.getGerant()).isEqualTo(gerantBack);

        gerantCaisse.gerant(null);
        assertThat(gerantCaisse.getGerant()).isNull();
    }
}
