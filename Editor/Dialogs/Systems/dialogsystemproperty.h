#ifndef DIALOGSYSTEMPROPERTY_H
#define DIALOGSYSTEMPROPERTY_H

#include <QDialog>
#include "systemproperty.h"

namespace Ui {
class DialogSystemProperty;
}

class DialogSystemProperty : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemProperty(SystemProperty &property, QWidget *parent =
        nullptr);
    ~DialogSystemProperty();

private:
    Ui::DialogSystemProperty *ui;
    SystemProperty &m_property;
};

#endif // DIALOGSYSTEMPROPERTY_H
