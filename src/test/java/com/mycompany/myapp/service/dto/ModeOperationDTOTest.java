package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ModeOperationDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ModeOperationDTO.class);
        ModeOperationDTO modeOperationDTO1 = new ModeOperationDTO();
        modeOperationDTO1.setId(1L);
        ModeOperationDTO modeOperationDTO2 = new ModeOperationDTO();
        assertThat(modeOperationDTO1).isNotEqualTo(modeOperationDTO2);
        modeOperationDTO2.setId(modeOperationDTO1.getId());
        assertThat(modeOperationDTO1).isEqualTo(modeOperationDTO2);
        modeOperationDTO2.setId(2L);
        assertThat(modeOperationDTO1).isNotEqualTo(modeOperationDTO2);
        modeOperationDTO1.setId(null);
        assertThat(modeOperationDTO1).isNotEqualTo(modeOperationDTO2);
    }
}
