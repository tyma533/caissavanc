package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EtablissementTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtablissementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Etablissement.class);
        Etablissement etablissement1 = getEtablissementSample1();
        Etablissement etablissement2 = new Etablissement();
        assertThat(etablissement1).isNotEqualTo(etablissement2);

        etablissement2.setId(etablissement1.getId());
        assertThat(etablissement1).isEqualTo(etablissement2);

        etablissement2 = getEtablissementSample2();
        assertThat(etablissement1).isNotEqualTo(etablissement2);
    }
}
