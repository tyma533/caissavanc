package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.DemandeTestSamples.*;
import static com.mycompany.myapp.domain.EtablissementTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DemandeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Demande.class);
        Demande demande1 = getDemandeSample1();
        Demande demande2 = new Demande();
        assertThat(demande1).isNotEqualTo(demande2);

        demande2.setId(demande1.getId());
        assertThat(demande1).isEqualTo(demande2);

        demande2 = getDemandeSample2();
        assertThat(demande1).isNotEqualTo(demande2);
    }

    @Test
    void etablissementTest() throws Exception {
        Demande demande = getDemandeRandomSampleGenerator();
        Etablissement etablissementBack = getEtablissementRandomSampleGenerator();

        demande.setEtablissement(etablissementBack);
        assertThat(demande.getEtablissement()).isEqualTo(etablissementBack);

        demande.etablissement(null);
        assertThat(demande.getEtablissement()).isNull();
    }
}
