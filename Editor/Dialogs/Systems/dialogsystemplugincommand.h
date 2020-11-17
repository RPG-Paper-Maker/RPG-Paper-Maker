#ifndef DIALOGSYSTEMPLUGINCOMMAND_H
#define DIALOGSYSTEMPLUGINCOMMAND_H

#include <QDialog>
#include "systemplugincommand.h"

namespace Ui {
class DialogSystemPluginCommand;
}

class DialogSystemPluginCommand : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemPluginCommand(SystemPluginCommand &command, QWidget
        *parent = nullptr);
    ~DialogSystemPluginCommand();

private:
    Ui::DialogSystemPluginCommand *ui;
    SystemPluginCommand &m_command;
};

#endif // DIALOGSYSTEMPLUGINCOMMAND_H
