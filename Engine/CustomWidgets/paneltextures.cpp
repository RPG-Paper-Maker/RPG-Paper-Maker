#include "paneltextures.h"
#include "ui_paneltextures.h"

PanelTextures::PanelTextures(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelTextures)
{
    ui->setupUi(this);
}

PanelTextures::~PanelTextures()
{
    delete ui;
}
