#include "paneltroopreaction.h"
#include "ui_paneltroopreaction.h"

PanelTroopReaction::PanelTroopReaction(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelTroopReaction)
{
    ui->setupUi(this);
}

PanelTroopReaction::~PanelTroopReaction()
{
    delete ui;
}
