#include "dialogcommandwait.h"
#include "ui_dialogcommandwait.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandWait::DialogCommandWait(EventCommand *command, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandWait)
{
    ui->setupUi(this);
    

    if (command != nullptr)
        initialize(command);
}

DialogCommandWait::~DialogCommandWait()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandWait::initialize(EventCommand* command){
    ui->doubleSpinBox->setValue(command->valueCommandAt(0).toDouble());
}

// -------------------------------------------------------

EventCommand* DialogCommandWait::getCommand() const{
    QVector<QString> command;
    command.append(QString::number(ui->doubleSpinBox->value()));

    return new EventCommand(EventCommandKind::Wait, command);
}
