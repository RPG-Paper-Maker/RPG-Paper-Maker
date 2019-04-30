/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemstate.h"
#include "ui_dialogsystemstate.h"
#include "rpm.h"
#include "dialogcompleteliststates.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemState::DialogSystemState(SystemState& state, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemState),
    m_state(state),
    m_needUpdate(true)
{
    ui->setupUi(this);
    
    initialize();
}

DialogSystemState::~DialogSystemState()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemState::initialize(){
    int stateIndex = SuperListItem::getIndexById(
                RPM::get()->project()->gameDatas()->commonEventsDatas()
                ->modelStates()->invisibleRootItem(),
                m_state.id());
    SuperListItem::fillComboBox(ui->comboBox, RPM::get()->project()
                                ->gameDatas()->commonEventsDatas()
                                ->modelStates());
    ui->comboBox->setCurrentIndex(stateIndex);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemState::on_comboBox_currentIndexChanged(int index) {
    if (m_needUpdate) {
        SuperListItem* state = reinterpret_cast<SystemState *>(RPM::get()
            ->project()->gameDatas()->commonEventsDatas()->modelStates()->item(
            index)->data().value<qintptr>());
        m_state.setState(state);
    }
}

// -------------------------------------------------------

void DialogSystemState::on_pushButtonStates_clicked() {
    DialogCompleteListStates dialog;

    if (dialog.exec() == QDialog::Accepted) {
        m_needUpdate = false;
        RPM::get()->project()->writeCommonEvents();
        ui->comboBox->clear();
        m_needUpdate = true;
        initialize();
    } else {
        RPM::get()->project()->readCommonEvents();
    }
}
