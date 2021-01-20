/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
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

    this->translate();
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
                m_state.id(), true);
    SuperListItem::fillComboBox(ui->comboBox, RPM::get()->project()
                                ->gameDatas()->commonEventsDatas()
                                ->modelStates());
    ui->comboBox->setCurrentIndex(stateIndex);
}

//-------------------------------------------------

void DialogSystemState::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SELECT_A_STATE) + RPM
        ::DOT_DOT_DOT);
    ui->labelState->setText(RPM::translate(Translations::STATE_ID) + RPM::COLON);
    ui->pushButtonStates->setText(RPM::translate(Translations
        ::UPDATE_COMPLETE_LIST) + RPM::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemState::accept()
{
    int id = SuperListItem::getIdByIndex(RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelStates(), ui->comboBox->currentIndex());
    if (RPM::get()->project()->currentObject() != nullptr)
    {
        SuperListItem *state;
        QStandardItemModel *model = RPM::get()->project()->currentObject()
            ->modelStates();
        for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
        {
            state = reinterpret_cast<SuperListItem *>(model->item(i)->data()
                .value<quintptr>());
            if (state != nullptr && state->id() == id)
            {
                QMessageBox::information(this, RPM::translate(Translations
                    ::WARNING), RPM::translate(Translations
                    ::CANNOT_DUPLICATE_STATE) + RPM::SPACE + state->toString());
                return;
            }
        }
    }
    QDialog::accept();
}

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
    QStandardItemModel *copyModelStates;

    copyModelStates = new QStandardItemModel;
    SuperListItem::copyModel(copyModelStates, RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelStates());
    DialogCompleteListStates dialog;
    if (dialog.exec() == QDialog::Accepted) {
        m_needUpdate = false;
        RPM::get()->project()->writeCommonEvents();
        ui->comboBox->clear();
        m_needUpdate = true;
        initialize();
    } else {
        SuperListItem::deleteModel(RPM::get()->project()->gameDatas()
            ->commonEventsDatas()->modelStates(), false);
        SuperListItem::copyModel(RPM::get()->project()
            ->gameDatas()->commonEventsDatas()->modelStates(), copyModelStates);
    }
    SuperListItem::deleteModel(copyModelStates);
}
