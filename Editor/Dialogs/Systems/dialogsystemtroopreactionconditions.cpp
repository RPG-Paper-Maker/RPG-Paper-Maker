#include "dialogsystemtroopreactionconditions.h"
#include "ui_dialogsystemtroopreactionconditions.h"

DialogSystemTroopReactionConditions::DialogSystemTroopReactionConditions(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemTroopReactionConditions)
{
    ui->setupUi(this);
}

DialogSystemTroopReactionConditions::~DialogSystemTroopReactionConditions()
{
    delete ui;
}
