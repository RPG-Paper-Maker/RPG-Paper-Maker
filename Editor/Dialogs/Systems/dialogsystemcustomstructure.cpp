#include "dialogsystemcustomstructure.h"
#include "ui_dialogsystemcustomstructure.h"

DialogSystemCustomStructure::DialogSystemCustomStructure(SystemCustomStructure
    &custom, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCustomStructure),
    m_custom(custom)
{
    ui->setupUi(this);
}

DialogSystemCustomStructure::~DialogSystemCustomStructure()
{
    delete ui;
}
