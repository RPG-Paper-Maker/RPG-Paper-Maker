#include "dialogsystemtroopreactionconditions.h"
#include "ui_dialogsystemtroopreactionconditions.h"

DialogSystemTroopReactionConditions::DialogSystemTroopReactionConditions(
    SystemTroopReactionConditions &conditions, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemTroopReactionConditions),
    m_conditions(conditions)
{
    ui->setupUi(this);
}

DialogSystemTroopReactionConditions::~DialogSystemTroopReactionConditions()
{
    delete ui;
}
