#include "dialogsystemproperty.h"
#include "ui_dialogsystemproperty.h"

DialogSystemProperty::DialogSystemProperty(SystemProperty &property, QWidget
    *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemProperty),
    m_property(property)
{
    ui->setupUi(this);
}

DialogSystemProperty::~DialogSystemProperty()
{
    delete ui;
}
