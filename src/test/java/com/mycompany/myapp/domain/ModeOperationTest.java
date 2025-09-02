package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ModeOperationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ModeOperationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ModeOperation.class);
        ModeOperation modeOperation1 = getModeOperationSample1();
        ModeOperation modeOperation2 = new ModeOperation();
        assertThat(modeOperation1).isNotEqualTo(modeOperation2);

        modeOperation2.setId(modeOperation1.getId());
        assertThat(modeOperation1).isEqualTo(modeOperation2);

        modeOperation2 = getModeOperationSample2();
        assertThat(modeOperation1).isNotEqualTo(modeOperation2);
    }
}
