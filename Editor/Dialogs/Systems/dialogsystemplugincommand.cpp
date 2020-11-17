#include "dialogsystemplugincommand.h"
#include "ui_dialogsystemplugincommand.h"

DialogSystemPluginCommand::DialogSystemPluginCommand(SystemPluginCommand
    &command, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemPluginCommand),
    m_command(command)
{
    ui->setupUi(this);
}

DialogSystemPluginCommand::~DialogSystemPluginCommand()
{
    delete ui;
}
