/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemstatistic.h"
#include "ui_dialogsystemstatistic.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemStatistic::DialogSystemStatistic(SystemStatistic &statistic,
                                             QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemStatistic),
    m_statistic(statistic)
{
    ui->setupUi(this);
    

    initialize();

    this->translate();
}

DialogSystemStatistic::~DialogSystemStatistic()
{
    delete ui;
}

SystemStatistic& DialogSystemStatistic::statistic() const {
    return m_statistic;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemStatistic::initialize(){
    ui->widgetName->initializeNamesLang(&m_statistic);
    ui->lineEditAbbrevation->setText(m_statistic.abbreviation());

    if (m_statistic.isFix())
        ui->radioButtonFix->setChecked(true);
    else
        ui->radioButtonBar->setChecked(true);
}

//-------------------------------------------------

void DialogSystemStatistic::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_STATISTIC) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelScriptAbbreviation->setText(RPM::translate(Translations
        ::SCRIPT_ABBREVIATION) + RPM::COLON);
    ui->radioButtonBar->setText(RPM::translate(Translations::BAR));
    ui->radioButtonFix->setText(RPM::translate(Translations::FIX));
    ui->groupBoxProperties->setTitle(RPM::translate(Translations::PROPERTIES));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemStatistic::on_lineEditAbbrevation_textChanged(
        const QString & text)
{
    m_statistic.setAbbreviation(text);
}

// -------------------------------------------------------

void DialogSystemStatistic::on_radioButtonFix_toggled(bool check){
    m_statistic.setIsFix(check);
}
