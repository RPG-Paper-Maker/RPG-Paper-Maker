/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemanimationframeeffect.h"
#include "ui_dialogsystemanimationframeeffect.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemAnimationFrameEffect::DialogSystemAnimationFrameEffect(
    SystemAnimationFrameEffect &effect, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemAnimationFrameEffect),
    m_effect(effect)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemAnimationFrameEffect::~DialogSystemAnimationFrameEffect() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemAnimationFrameEffect::initialize() {
    int indexCondition;

    indexCondition = static_cast<int>(m_effect.condition());
    ui->comboBoxCondition->addItems(RPM::ENUM_TO_STRING_ANIMATION_CONDITION_KIND);
    ui->radioButtonSoundEffect->setChecked(m_effect.isSoundEffect());
    ui->widgetSongSoundEffect->initialize(m_effect.soundEffect());
    ui->comboBoxCondition->setCurrentIndex(indexCondition);
}

//-------------------------------------------------

void DialogSystemAnimationFrameEffect::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemAnimationFrameEffect::on_radioButtonSoundEffect_toggled(bool
    checked)
{
    m_effect.setIsSoundEffect(checked);
    ui->widgetSongSoundEffect->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemAnimationFrameEffect::on_radioButtonFlash_toggled(bool checked)
{
    m_effect.setIsSoundEffect(!checked);
    ui->pushButtonFlash->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemAnimationFrameEffect::on_pushButtonFlash_clicked() {
    // TODO
}

// -------------------------------------------------------

void DialogSystemAnimationFrameEffect::on_comboBoxCondition_currentIndexChanged(
    int index)
{
    m_effect.setCondition(static_cast<AnimationEffectConditionKind>(index));
}
